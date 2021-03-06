package com.antheminc.oss.nimbus.core.domain.config.builder.attributes;

import static org.junit.Assert.*;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import javax.validation.constraints.NotNull;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;

import com.antheminc.oss.nimbus.test.sample.um.model.core.TestBean;

/**
 * 
 * @author Tony Lopez (AF42192)
 * @author Sandeep Mantha - added test cases for date validator
 *
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(MockitoJUnitRunner.class)
public class ConstraintAnnotationAttributeHandlerTest {

	@InjectMocks
	private ConstraintAnnotationAttributeHandler testee;
	
	@NotNull(message = "Enter a value for t1_str")
	private final String t1_str = null;
	
	@NotNull
	private final String t2_str = null;
	
	private static Validator validator;
    
    @BeforeClass
    public static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }
    
	@Test
	public void t1_generateFrom_messageProvided() throws Exception {
		final Field annotatedElement = this.getClass().getDeclaredField("t1_str");
		final Annotation annotation = annotatedElement.getAnnotation(NotNull.class);
		final Map<String, Object> actual = this.testee.generateFrom(annotatedElement, annotation);
		Assert.assertEquals("Enter a value for t1_str", actual.get("message"));
	}
	
	@Test
	public void t2_generateFrom_noMessageProvided() throws Exception {
		final Field annotatedElement = this.getClass().getDeclaredField("t2_str");
		final Annotation annotation = annotatedElement.getAnnotation(NotNull.class);
		final Map<String, Object> actual = this.testee.generateFrom(annotatedElement, annotation);
		Assert.assertEquals("", actual.get("message"));
	}
    
//    @Test
//    public void testDateRangeNegative() {
//    	TestBean test = new TestBean();
//        String date = "03/15/2017";
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
//        test.setDt(LocalDate.parse(date,formatter));
//        
//        java.util.Set<ConstraintViolation<TestBean>> validate = (java.util.Set<ConstraintViolation<TestBean>>) validator.validate(test);
//        System.out.println(validate);
//        assertEquals(1, validate.size());
//        assertEquals("dt", validate.iterator().next().getPropertyPath().toString());
//    }
//    
//    @Test
//    public void testDateRangePositive() {
//        TestBean test = new TestBean();
//        String date = "03/15/2018";
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
//        test.setDt(LocalDate.parse(date,formatter));
//        
//        java.util.Set<ConstraintViolation<TestBean>> validate = (java.util.Set<ConstraintViolation<TestBean>>) validator.validate(test);
//        System.out.println(validate);
//        assertEquals(0, validate.size());
//    }
}

